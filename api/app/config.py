"""Centralized settings. Keep this boring."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str | None = None
    openai_api_key: str | None = None

    polymarket_gamma_url: str = "https://gamma-api.polymarket.com"
    kalshi_api_url: str = "https://api.elections.kalshi.com/trade-api/v2"

    # When True, the API returns fixture data instead of calling upstream
    # markets. Default False so live ingestion runs; flip to True for
    # offline demos or CI. Override via env var USE_FIXTURES=true.
    use_fixtures: bool = False

    # When True and an Anthropic key is configured, augment the reasoner's
    # base graph with speculative LLM-proposed 2nd-order tickers and a
    # tailored executive summary. Safe to enable by default — if the key
    # is missing we skip silently.
    enable_llm_enrichment: bool = True


settings = Settings()
