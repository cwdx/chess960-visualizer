const SERP_API_KEY = process.env.SERP_API_KEY;
const DEFAULT_QUERY = "Chess 960 random freestyle hikaru";
const fallback = {
    url: "https://www.youtube.com/watch?v=GUTZYXX7iTM",
    title: "A guide to Freestyle Chess (960)",
    channel: "freestyle_chess",
    thumbnail: "https://placehold.co/600x400",
    description: "A guide to Freestyle Chess (960)",
};
const cachedVideo = {
    key: "video",
    video: fallback,
    timestamp: 0,
    ttl: 1000 * 60 * 60 * 24, // 1 day
};
export async function getVideo(query = DEFAULT_QUERY) {
    try {
        if (cachedVideo.timestamp + cachedVideo.ttl > Date.now() &&
            cachedVideo.key === query) {
            return cachedVideo.video;
        }
        const url = `https://serpapi.com/search.json?engine=youtube&search_query=${query}&num=3&limit=10&&sort=relevance&api_key=${SERP_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            return fallback;
        }
        const data = await response.json();
        const prefferedChannel = "https://www.youtube.com/@GMHikaru";
        const videoResults = data?.video_results || [];
        if (videoResults.length === 0) {
            return fallback;
        }
        const sortedVideoResults = videoResults.sort((a, b) => b.views - a.views);
        let video = sortedVideoResults[0];
        // if hikau in top 5 return that
        if (sortedVideoResults.some((video) => video.channel.link.includes(prefferedChannel))) {
            video = sortedVideoResults.find((video) => video.channel.link.includes(prefferedChannel));
        }
        cachedVideo.video = {
            url: video.link,
            title: video.title,
            channel: video.channel.name,
            thumbnail: video.thumbnail.rich,
            description: video.description,
        };
        cachedVideo.timestamp = Date.now();
        return {
            url: video.link,
            title: video.title,
            channel: video.channel.name,
            thumbnail: video.thumbnail.rich,
            description: video.description,
        };
    }
    catch (error) {
        console.error(error);
        return fallback;
    }
}
