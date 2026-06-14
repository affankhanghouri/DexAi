from pydantic import BaseModel


class GenerateCampaignAnglesRequest(BaseModel):
    draft_id: str


class CampaignAngleOption(BaseModel):
    angle_id: str
    title: str
    description: str
    why_it_works: str
    buyer_trigger: str
    recommended_for: str
    confidence: float


class GenerateCampaignAnglesResponse(BaseModel):
    draft_id: str
    brand_profile_id: str | None
    angles: list[CampaignAngleOption]
