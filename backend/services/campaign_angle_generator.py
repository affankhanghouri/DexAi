def fallback_campaign_angles(
    brand_profile: dict | None,
    campaign_draft: dict,
) -> list[dict]:
    category = campaign_draft.get("category") or "product"
    product = campaign_draft.get("product_name") or "this product"
    tone = "clear and seller-friendly"

    if brand_profile:
        tone = brand_profile.get("tone") or tone

    return [
        {
            "angle_id": "premium-look",
            "title": "Premium Look",
            "description": f"Position {product} as a polished, high-quality {category}.",
            "why_it_works": "Premium framing increases perceived value and buyer confidence.",
            "buyer_trigger": "Aspiration, quality perception, and gift-worthiness.",
            "recommended_for": "Products with strong visuals, clean styling, or gifting potential.",
            "confidence": 0.86,
        },
        {
            "angle_id": "comfort-use",
            "title": "Daily Use",
            "description": f"Show why {product} fits naturally into everyday life.",
            "why_it_works": "Practical use cases make the product easier to imagine buying.",
            "buyer_trigger": "Usefulness, routine fit, and low-friction decision making.",
            "recommended_for": "Products where comfort, utility, or repeated use matters.",
            "confidence": 0.8,
        },
        {
            "angle_id": "offer-push",
            "title": "Offer Push",
            "description": "Make the price, offer, or order action feel immediate and clear.",
            "why_it_works": "Urgency and value clarity can increase WhatsApp inquiries.",
            "buyer_trigger": "Price sensitivity, urgency, and fast order intent.",
            "recommended_for": "Campaigns built around discounts, launches, or limited stock.",
            "confidence": 0.82,
        },
        {
            "angle_id": "trust-delivery",
            "title": "Trust + Delivery",
            "description": f"Reassure buyers that ordering {product} is simple and reliable.",
            "why_it_works": "Trust signals reduce hesitation before a first purchase.",
            "buyer_trigger": "Risk reduction, proof, delivery clarity, and seller reliability.",
            "recommended_for": f"{tone} brands where buyers need reassurance before ordering.",
            "confidence": 0.78,
        },
    ]
