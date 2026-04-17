/* ID-START: SEA_ENG_001 */
export interface MediaResult {
  sid: string;
  title: string;
  duration: string;
  platform: 'YouTube' | 'Facebook' | 'TikTok';
  thumbUrl: string;
  streamUrl: string;
}

export const fetchMediaResults = async (query: string): Promise<MediaResult[]> => {
  // Simulace API volání pro Synthesis Studio
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults: MediaResult[] = [
        {
          sid: `VID-${Date.now()}-1`,
          title: `Synthesis Overview: ${query || 'General'}`,
          duration: '05:22',
          platform: 'YouTube',
          thumbUrl: 'https://picsum.photos/seed/syn1/400/225',
          streamUrl: '#'
        },
        {
          sid: `VID-${Date.now()}-2`,
          title: `Creative Core: ${query || 'Trends'}`,
          duration: '03:45',
          platform: 'TikTok',
          thumbUrl: 'https://picsum.photos/seed/syn2/400/225',
          streamUrl: '#'
        },
        {
          sid: `VID-${Date.now()}-3`,
          title: `Social Stream: ${query || 'Vibe'}`,
          duration: '12:10',
          platform: 'Facebook',
          thumbUrl: 'https://picsum.photos/seed/syn3/400/225',
          streamUrl: '#'
        }
      ];
      resolve(mockResults);
    }, 800);
  });
};
/* ID-END: SEA_ENG_001 */
