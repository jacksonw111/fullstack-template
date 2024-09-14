import httpx
from sqlalchemy import JSON
import urllib.parse


base_url = "https://x.com/i/api/graphql"
token = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
headers = {
    "authority": "x.com",
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": f"Bearer {token}",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "dnt": "1",
    "pragma": "no-cache",
    "referer": "https://x.com/narendramodi",
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en",
    "x-csrf-token": "b3b37a17ef37c4b4343a83106cb9fd46b7489b916636a5652bb555c09d594a9b848cb8d65055d50b21adabaf6cbe607b36427245c1cdc5abbb1025bb41051e642de4048766e75ce11a86555a01774b05",  # noqa
}


async def gather_results(instructions):
    for instruction in instructions:
        if instruction.get("type") != "TimelineAddEntries":
            continue
        entries = instruction.get("entries")
        for entrie in entries:
            pass


async def get_user_id(name: str):
    url = f"{base_url}/-0XdHI-mrHWBQd8-oLo1aA/ProfileSpotlightsQuery?variables=%7B%22screen_name%22%3A%22{name}%22%7D"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        return response.json().get("data").get("user").get("rest_id")


async def get_user_tweets(user_id: str):
    url = f"{base_url}/E3opETHurmVJflFsUBVuUQ/UserTweets"
    variables = urllib.parse.quote(
        JSON.dumps(
            {
                "userId": f"{user_id}",
                "count": 20,
                "includePromotedContent": True,
                "withQuickPromoteEligibilityTweetFields": True,
                "withVoice": True,
                "withV2Timeline": True,
            }
        )
    )
    features = "%7B%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D"
    fieldToggles = "%7B%22withArticlePlainText%22%3Afalse%7D"
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"${url}?variables={variables}&features={features}&fieldToggles={fieldToggles}",
            headers=headers,
        )
        # data.user.result.timeline_v2.timeline.instructions[2].entries[n].content.itemContent.tweet_results.result.legacy.full_text
        # response.json().get("data").get("user").get("rest_id")
        return gather_results(
            response.json()
            .get("data")
            .get("user")
            .get("result")
            .get("timeline_v2")
            .get("timeline")
            .get("instructions")
        )
