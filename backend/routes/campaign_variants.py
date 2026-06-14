from fastapi import APIRouter, HTTPException

from schemas.campaign_variants import (
    GenerateVariantsRequest,
    GenerateVariantsResponse,
    RefineVariantRequest,
    RefineVariantResponse,
)
from services.campaign_variant_generator import (
    fallback_campaign_variants,
    fallback_refine_variant,
)
from services.llm_client import (
    generate_campaign_variants_with_llm,
    refine_campaign_variant_with_llm,
)
from services.supabase_service import get_supabase


router = APIRouter(prefix="/campaign-variants", tags=["Campaign Variants"])


def get_draft_and_brand(draft_id: str):
    supabase = get_supabase()
    draft_result = (
        supabase.table("campaign_drafts")
        .select("*")
        .eq("id", draft_id)
        .single()
        .execute()
    )

    if not draft_result.data:
        raise HTTPException(status_code=404, detail="Campaign draft not found.")

    draft = draft_result.data
    brand_profile = None
    brand_profile_id = draft.get("brand_profile_id")

    if brand_profile_id:
        brand_result = (
            supabase.table("brand_profiles")
            .select("*")
            .eq("id", brand_profile_id)
            .single()
            .execute()
        )
        brand_profile = brand_result.data

    return draft, brand_profile, brand_profile_id


@router.post("/generate", response_model=GenerateVariantsResponse)
async def generate_campaign_variants_route(payload: GenerateVariantsRequest):
    supabase = get_supabase()
    draft, brand_profile, brand_profile_id = get_draft_and_brand(payload.draft_id)

    if not draft.get("selected_angle_id"):
        raise HTTPException(
            status_code=400,
            detail="Select a campaign angle before generating variants.",
        )

    try:
        llm_result = generate_campaign_variants_with_llm(
            brand_profile=brand_profile,
            campaign_draft=draft,
        )
        variants = llm_result["variants"]
    except Exception:
        variants = fallback_campaign_variants(
            brand_profile=brand_profile,
            campaign_draft=draft,
        )

    supabase.table("campaign_variant_options").delete().eq(
        "draft_id",
        payload.draft_id,
    ).execute()

    rows = []
    for variant in variants:
        rows.append(
            {
                "draft_id": payload.draft_id,
                "brand_profile_id": brand_profile_id,
                "selected_angle_id": draft.get("selected_angle_id"),
                "variant_id": variant["variant_id"],
                "name": variant["name"],
                "description": variant["description"],
                "visual_direction": variant["visual_direction"],
                "caption_style": variant["caption_style"],
                "whatsapp_style": variant["whatsapp_style"],
                "poster_layout": variant["poster_layout"],
                "why_it_fits": variant["why_it_fits"],
                "confidence": variant["confidence"],
                "refinement_count": 0,
                "is_refined": False,
            }
        )

    insert_result = supabase.table("campaign_variant_options").insert(rows).execute()

    if not insert_result.data:
        raise HTTPException(status_code=500, detail="Could not save variants.")

    return {
        "draft_id": payload.draft_id,
        "brand_profile_id": brand_profile_id,
        "selected_angle_id": draft.get("selected_angle_id"),
        "variants": [
            {
                "variant_id": row["variant_id"],
                "name": row["name"],
                "description": row["description"],
                "visual_direction": row["visual_direction"],
                "caption_style": row["caption_style"],
                "whatsapp_style": row["whatsapp_style"],
                "poster_layout": row["poster_layout"],
                "why_it_fits": row["why_it_fits"],
                "confidence": float(row["confidence"]),
                "refinement_count": int(row["refinement_count"]),
                "is_refined": bool(row["is_refined"]),
            }
            for row in insert_result.data
        ],
    }


@router.post("/refine", response_model=RefineVariantResponse)
async def refine_campaign_variant_route(payload: RefineVariantRequest):
    supabase = get_supabase()
    draft, brand_profile, _brand_profile_id = get_draft_and_brand(payload.draft_id)

    variant_result = (
        supabase.table("campaign_variant_options")
        .select("*")
        .eq("draft_id", payload.draft_id)
        .eq("variant_id", payload.variant_id)
        .single()
        .execute()
    )

    if not variant_result.data:
        raise HTTPException(status_code=404, detail="Variant not found.")

    current_variant = variant_result.data

    try:
        refined = refine_campaign_variant_with_llm(
            brand_profile=brand_profile,
            campaign_draft=draft,
            variant=current_variant,
            refine_instruction=payload.refine_instruction,
        )
    except Exception:
        refined = fallback_refine_variant(
            variant=current_variant,
            refine_instruction=payload.refine_instruction,
        )

    new_refinement_count = int(current_variant.get("refinement_count") or 0) + 1

    update_payload = {
        "name": refined["name"],
        "description": refined["description"],
        "visual_direction": refined["visual_direction"],
        "caption_style": refined["caption_style"],
        "whatsapp_style": refined["whatsapp_style"],
        "poster_layout": refined["poster_layout"],
        "why_it_fits": refined["why_it_fits"],
        "confidence": refined["confidence"],
        "refinement_count": new_refinement_count,
        "is_refined": True,
    }

    update_result = (
        supabase.table("campaign_variant_options")
        .update(update_payload)
        .eq("draft_id", payload.draft_id)
        .eq("variant_id", payload.variant_id)
        .execute()
    )

    if not update_result.data:
        raise HTTPException(status_code=500, detail="Could not refine variant.")

    row = update_result.data[0]

    return {
        "draft_id": payload.draft_id,
        "variant": {
            "variant_id": row["variant_id"],
            "name": row["name"],
            "description": row["description"],
            "visual_direction": row["visual_direction"],
            "caption_style": row["caption_style"],
            "whatsapp_style": row["whatsapp_style"],
            "poster_layout": row["poster_layout"],
            "why_it_fits": row["why_it_fits"],
            "confidence": float(row["confidence"]),
            "refinement_count": int(row["refinement_count"]),
            "is_refined": bool(row["is_refined"]),
        },
    }
