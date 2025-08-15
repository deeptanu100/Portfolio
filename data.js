// --- SOCIAL FEED DATA ---

// NOTE: Instagram thumbnails cannot be fetched automatically. 
// Replace the 'insta-1.svg' and 'insta-2.svg' with direct URLs to thumbnail images you have uploaded.
const socialFeedData = [
    {
        platform: 'insta',
        sourceUrl: 'https://www.instagram.com/reel/DNPaMPPSYDF',
        thumbnailUrl: 'insta-1.svg',
        embedUrl: '', // Not used for Instagram
        aspectRatio: '16:9',
        postDate: '2025-08-14',
        description: 'Latest updates from Instagram!'
    },
    {
        platform: 'yt',
        sourceUrl: 'https://youtu.be/lEg9ewVlDo0',
        thumbnailUrl: 'https://i.ytimg.com/vi/lEg9ewVlDo0/hqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/lEg9ewVlDo0',
        aspectRatio: '16:9',
        postDate: '2025-08-14',
        description: 'Check out our new YouTube video.'
    },
    {
        platform: 'insta',
        sourceUrl: 'https://www.instagram.com/reel/DMnfIrTy49d',
        thumbnailUrl: 'insta-2.svg',
        embedUrl: '', // Not used for Instagram
        aspectRatio: '16:9',
        postDate: '2025-08-01',
        description: 'A throwback from our feed.'
    },
    {
        platform: 'yt',
        sourceUrl: 'https://youtu.be/KtRgqaK8BW0',
        thumbnailUrl: 'https://i.ytimg.com/vi/KtRgqaK8BW0/hqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/KtRgqaK8BW0',
        aspectRatio: '16:9',
        postDate: '2025-07-20',
        description: 'Exploring new concepts and ideas.'
    },
    {
        platform: 'yt',
        sourceUrl: 'https://youtu.be/5dTOX1MlRTg',
        thumbnailUrl: 'https://i.ytimg.com/vi/5dTOX1MlRTg/hqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/5dTOX1MlRTg',
        aspectRatio: '16:9',
        postDate: '2025-07-15',
        description: 'A deep dive into creative design.'
    },
    {
        platform: 'yt',
        sourceUrl: 'https://youtu.be/FF6BjReOTG0',
        thumbnailUrl: 'https://i.ytimg.com/vi/FF6BjReOTG0/hqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/FF6BjReOTG0',
        aspectRatio: '16:9',
        postDate: '2025-07-10',
        description: 'Weekly recap and highlights.'
    }
];

const platformLogos = {
    yt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path></svg>`,
    insta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.343,0.132,0.621,0.328,0.902,0.608 s0.477,0.559,0.608,0.902c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637s-0.009,2.688-0.052,3.637 c-0.04,0.877-0.187,1.354-0.31,1.671c-0.132,0.343-0.328,0.621-0.608,0.902s-0.559,0.477-0.902,0.608 c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.234,0.052-3.637,0.052s-2.688-0.009-3.637-0.052 c-0.877-0.04-1.354-0.187-1.671-0.31c-0.343-0.132-0.621-0.328-0.902-0.608s-0.477-0.559-0.902-0.608 c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12s0.009-2.688,0.052-3.637 c0.04-0.877,0.187-1.354,0.31-1.671c0.132-0.343,0.328-0.621,0.608-0.902s0.559-0.477,0.902-0.608 c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3C9.556,3,9.273,3.01,8.309,3.053 C7.331,3.098,6.632,3.251,6.01,3.501C5.379,3.754,4.86,4.145,4.34,4.665c-0.52,0.52-0.911,1.039-1.164,1.67 C2.925,6.97,2.772,7.67,2.727,8.647C2.683,9.612,2.675,9.894,2.675,12c0,2.106,0.008,2.388,0.052,3.353 c0.045,0.977,0.198,1.678,0.451,2.309c0.253,0.631,0.644,1.15,1.164,1.67c0.52,0.52,1.039,0.911,1.67,1.164 c0.631,0.253,1.332,0.406,2.309,0.451C9.273,20.99,9.556,21,12,21c2.444,0,2.727-0.01,3.691-0.053 c0.977-0.045,1.678-0.198,2.309-0.451c0.631-0.253,1.15-0.644,1.67-1.164c0.52-0.52,0.911-1.039,1.164-1.67 c0.253-0.631,0.406-1.332,0.451-2.309C21.317,14.388,21.325,14.106,21.325,12c0-2.106-0.008-2.388-0.052-3.353 c-0.045-0.977-0.198-1.678-0.451-2.309C20.569,5.709,20.178,5.19,19.658,4.67c-0.52-0.52-1.039-0.911-1.67-1.164 c-0.631-0.253-1.332-0.406-2.309-0.451C14.727,3.01,14.444,3,12,3L12,3z M12,7.378c-2.552,0-4.622,2.069-4.622,4.622 s2.069,4.622,4.622,4.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3 S13.657,15,12,15z M16.965,6.59c-0.6,0-1.086,0.486-1.086,1.086s0.486,1.086,1.086,1.086s1.086-0.486,1.086-1.086 S17.565,6.59,16.965,6.59z"></path></svg>`
};