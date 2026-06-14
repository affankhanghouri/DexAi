from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routes.brand_dna import router as brand_dna_router
from routes.brand_dna_enrichment import router as brand_dna_enrichment_router
from routes.brand_intake import router as brand_intake_router
from routes.campaign_angles import router as campaign_angles_router
from routes.campaign_asset_briefs import router as campaign_asset_briefs_router
from routes.campaign_ghost_editor import router as campaign_ghost_editor_router
from routes.campaign_generated_assets import router as campaign_generated_assets_router
from routes.campaign_variants import router as campaign_variants_router
from routes.final_campaign import router as final_campaign_router
from routes.poster_generation import router as poster_generation_router
from routes.product_dna import router as product_dna_router

app = FastAPI(
    title="Dhoom AI Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Dhoom AI backend is running",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }


app.include_router(brand_dna_router, prefix="/api/v1")
app.include_router(brand_dna_enrichment_router, prefix="/api/v1")
app.include_router(brand_intake_router, prefix="/api/v1")
app.include_router(campaign_angles_router, prefix="/api/v1")
app.include_router(campaign_asset_briefs_router, prefix="/api/v1")
app.include_router(campaign_ghost_editor_router, prefix="/api/v1")
app.include_router(campaign_generated_assets_router, prefix="/api/v1")
app.include_router(campaign_variants_router, prefix="/api/v1")
app.include_router(final_campaign_router, prefix="/api/v1")
app.include_router(poster_generation_router, prefix="/api/v1")
app.include_router(product_dna_router, prefix="/api/v1")
