from fastapi import APIRouter, HTTPException

from schemas.campaign_angles import (
    GenerateCampaignAnglesRequest,
    GenerateCampaignAnglesResponse,
)
from services.campaign_angle_generator import fallback_campaign_angles
from services.supabase_service import get_supabase


router = APIRouter(prefix="/campaign-angles", tags=["Campaign Angles"])


@router.post("/generate", response_model=GenerateCampaignAnglesResponse)
async def generate_campaign_angles_route(payload: GenerateCampaignAnglesRequest):
    supabase = get_supabase()

    draft_result = (
        supabase.table("campaign_drafts")
        .select("*")
        .eq("id", payload.draft_id)
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

    return {
        "draft_id": payload.draft_id,
        "brand_profile_id": brand_profile_id,
        "angles": fallback_campaign_angles(
            brand_profile=brand_profile,
            campaign_draft=draft,
        ),
    }
