import json

from openai import OpenAI
from prompts.brand_dna_enrichment_prompt import (
    BRAND_DNA_ENRICHMENT_SYSTEM_PROMPT,
    build_brand_dna_enrichment_user_prompt,
)
from schemas.brand_dna_enrichment_output_schema import (
    BRAND_DNA_ENRICHMENT_JSON_SCHEMA,
)

from prompts.product_dna_prompt import (
    PRODUCT_DNA_SYSTEM_PROMPT,
    build_product_dna_user_prompt,
)
from schemas.product_dna_output_schema import PRODUCT_DNA_JSON_SCHEMA
from core.config import settings
from prompts.brand_dna_prompt import (
    BRAND_DNA_SYSTEM_PROMPT,
    build_brand_dna_user_prompt,
)
from prompts.campaign_variants_prompt import (
    CAMPAIGN_VARIANTS_SYSTEM_PROMPT,
    REFINE_VARIANT_SYSTEM_PROMPT,
    build_campaign_variants_user_prompt,
    build_refine_variant_user_prompt,
)
from prompts.campaign_quality_prompt import (
    CAMPAIGN_QUALITY_SYSTEM_PROMPT,
    build_campaign_quality_user_prompt,
)
from prompts.campaign_asset_brief_prompt import (
    CAMPAIGN_ASSET_BRIEF_SYSTEM_PROMPT,
    build_campaign_asset_brief_user_prompt,
)
from prompts.campaign_asset_brief_refinement import (
    CAMPAIGN_ASSET_BRIEF_REFINEMENT_SYSTEM_PROMPT,
    build_campaign_asset_brief_refinement_user_prompt,
)
from prompts.campaign_ghost_editor_prompt import (
    CAMPAIGN_GHOST_EDITOR_SYSTEM_PROMPT,
    build_campaign_ghost_editor_user_prompt,
)
from prompts.final_campaign_prompt import (
    FINAL_CAMPAIGN_SYSTEM_PROMPT,
    build_final_campaign_user_prompt,
)
from schemas.brand_dna_output_schema import BRAND_DNA_JSON_SCHEMA
from schemas.campaign_variants_output_scheme import (
    CAMPAIGN_VARIANTS_JSON_SCHEMA,
    REFINED_VARIANT_JSON_SCHEMA,
)
from schemas.campaign_quality_output_schema import CAMPAIGN_QUALITY_JSON_SCHEMA
from schemas.campaign_asset_brief_output_schema import (
    CAMPAIGN_ASSET_BRIEF_JSON_SCHEMA,
)
from schemas.campaign_ghost_editor_output_schema import (
    CAMPAIGN_GHOST_EDITOR_JSON_SCHEMA,
)
from schemas.final_campaign_output_schema import FINAL_CAMPAIGN_JSON_SCHEMA


client = OpenAI(api_key=settings.OPENAI_API_KEY)


def json_schema_text_format(schema: dict) -> dict:
    return {
        "format": {
            "type": "json_schema",
            "name": schema["name"],
            "schema": schema["schema"],
            "strict": schema.get("strict", True),
        }
    }


def parse_json_output(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError("Model returned invalid JSON.") from exc


def generate_brand_dna_with_llm(context: dict) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=BRAND_DNA_SYSTEM_PROMPT,
        input=build_brand_dna_user_prompt(context),
        text=json_schema_text_format(BRAND_DNA_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty response.")

    return parse_json_output(output_text)


def generate_campaign_variants_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=CAMPAIGN_VARIANTS_SYSTEM_PROMPT,
        input=build_campaign_variants_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
        ),
        text=json_schema_text_format(CAMPAIGN_VARIANTS_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty response.")

    return parse_json_output(output_text)


def refine_campaign_variant_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
    variant: dict,
    refine_instruction: str,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=REFINE_VARIANT_SYSTEM_PROMPT,
        input=build_refine_variant_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
            variant=variant,
            refine_instruction=refine_instruction,
        ),
        text=json_schema_text_format(REFINED_VARIANT_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty response.")

    return parse_json_output(output_text)


def generate_final_campaign_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=FINAL_CAMPAIGN_SYSTEM_PROMPT,
        input=build_final_campaign_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
        ),
        text=json_schema_text_format(FINAL_CAMPAIGN_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty final campaign response.")

    return parse_json_output(output_text)


def quality_check_final_campaign_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
    final_campaign: dict,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=CAMPAIGN_QUALITY_SYSTEM_PROMPT,
        input=build_campaign_quality_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
            final_campaign=final_campaign,
        ),
        text=json_schema_text_format(CAMPAIGN_QUALITY_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty campaign quality response.")

    return parse_json_output(output_text)


def generate_product_dna_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
) -> dict:
    image_url = campaign_draft.get("product_image_url")

    content = [
        {
            "type": "input_text",
            "text": build_product_dna_user_prompt(
                brand_profile=brand_profile,
                campaign_draft=campaign_draft,
            ),
        }
    ]

    if image_url:
        content.append(
            {
                "type": "input_image",
                "image_url": image_url,
            }
        )

    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=PRODUCT_DNA_SYSTEM_PROMPT,
        input=[
            {
                "role": "user",
                "content": content,
            }
        ],
        text=json_schema_text_format(PRODUCT_DNA_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty product DNA response.")

    return parse_json_output(output_text)


def enrich_brand_dna_with_llm(
    brand_profile: dict,
    answers: dict,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=BRAND_DNA_ENRICHMENT_SYSTEM_PROMPT,
        input=build_brand_dna_enrichment_user_prompt(
            brand_profile=brand_profile,
            answers=answers,
        ),
        text=json_schema_text_format(BRAND_DNA_ENRICHMENT_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty enriched Brand DNA response.")

    return parse_json_output(output_text)


def generate_campaign_asset_brief_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
    final_campaign: dict,
    quality_report: dict,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=CAMPAIGN_ASSET_BRIEF_SYSTEM_PROMPT,
        input=build_campaign_asset_brief_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
            final_campaign=final_campaign,
            quality_report=quality_report,
        ),
        text=json_schema_text_format(CAMPAIGN_ASSET_BRIEF_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty campaign asset brief response.")

    return parse_json_output(output_text)


def refine_campaign_asset_brief_with_llm(
    brand_profile: dict | None,
    campaign_draft: dict,
    final_campaign: dict,
    asset_brief: dict,
    refine_instruction: str,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=CAMPAIGN_ASSET_BRIEF_REFINEMENT_SYSTEM_PROMPT,
        input=build_campaign_asset_brief_refinement_user_prompt(
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
            final_campaign=final_campaign,
            asset_brief=asset_brief,
            refine_instruction=refine_instruction,
        ),
        text=json_schema_text_format(CAMPAIGN_ASSET_BRIEF_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty campaign asset brief refinement.")

    return parse_json_output(output_text)


def refine_campaign_with_ghost_editor_llm(
    instruction: str,
    brand_profile: dict | None,
    campaign_draft: dict,
    current_campaign: dict,
    current_asset_brief: dict | None,
) -> dict:
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=CAMPAIGN_GHOST_EDITOR_SYSTEM_PROMPT,
        input=build_campaign_ghost_editor_user_prompt(
            instruction=instruction,
            brand_profile=brand_profile,
            campaign_draft=campaign_draft,
            current_campaign=current_campaign,
            current_asset_brief=current_asset_brief,
        ),
        text=json_schema_text_format(CAMPAIGN_GHOST_EDITOR_JSON_SCHEMA),
    )

    output_text = response.output_text

    if not output_text:
        raise ValueError("Model returned empty Ghost Editor response.")

    return parse_json_output(output_text)
