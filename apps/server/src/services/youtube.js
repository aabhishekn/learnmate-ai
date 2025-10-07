import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function searchYouTube(q, maxResults = 5) {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const { data } = await axios.get(url, {
    params: {
      key: YOUTUBE_API_KEY,
      q,
      part: 'snippet',
      type: 'video',
      maxResults,
      safeSearch: 'strict',
    },
  });
  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}
