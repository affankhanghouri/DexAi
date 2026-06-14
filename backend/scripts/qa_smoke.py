import importlib
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))


MODULES_TO_CHECK = [
    "app.main",

    "routes.brand_dna",
    "routes.brand_dna_enrichment",
    "routes.brand_intake",
    "routes.product_dna",
    "routes.campaign_angles",
    "routes.campaign_variants",
    "routes.final_campaign",
    "routes.campaign_asset_briefs",
    "routes.campaign_generated_assets",
    "routes.poster_generation",
    "routes.campaign_ghost_editor",

    "services.web_extractor",
    "services.brand_dna_pipeline",
    "services.brand_intake_service",
    "services.product_dna_analyzer",
    "services.campaign_angle_generator",
    "services.campaign_variant_generator",
    "services.final_campaign_generator",
    "services.campaign_quality_gate",
    "services.campaign_asset_brief_generator",
    "services.campaign_asset_brief_refinement",
    "services.campaign_generated_asset_slots",
    "services.poster_generation_service",
    "services.generated_asset_versions",
    "services.campaign_ghost_editor",

    "schemas.brand_dna",
    "schemas.product_dna",
    "schemas.campaign_angles",
    "schemas.campaign_variants",
    "schemas.final_campaign",
    "schemas.campaign_asset_brief_output_schema",
    "schemas.campaign_asset_brief_refinement",
    "schemas.campaign_generated_assets",
    "schemas.poster_generation",
    "schemas.campaign_ghost_editor",
    "schemas.campaign_ghost_editor_output_schema",
]


def main():
    print("\nDhoom Backend QA Smoke Test")
    print("=" * 34)

    failed = []

    for module_name in MODULES_TO_CHECK:
        try:
            importlib.import_module(module_name)
            print(f"✅ {module_name}")
        except Exception as exc:
            print(f"❌ {module_name}")
            print(f"   {type(exc).__name__}: {exc}")
            failed.append(module_name)

    print("=" * 34)

    if failed:
        print(f"\nFAILED: {len(failed)} module(s)")
        for item in failed:
            print(f"- {item}")
        raise SystemExit(1)

    print("\n✅ Backend import smoke test passed.")


if __name__ == "__main__":
    main()