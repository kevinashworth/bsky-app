import Image from "next/image";

import { agent } from "~/lib/api";

export default async function Homepage() {
  const feeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    limit: 12,
  });

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Top 12 Feeds</h1>
      <ul>
        {feeds.data.feeds.map((feed) => (
          <li key={feed.displayName}>
            <div className="flex flex-row gap-2">
              <div className="h-[50px] w-[50px]">
                {feed.avatar ? (
                  <Image
                    src={feed.avatar}
                    alt="avatar"
                    height={50}
                    width={50}
                  />
                ) : <div />}
              </div>
              <div>
                <div className="font-semibold">{feed.displayName}</div>
                <div className="pb-2">{feed.description}</div>
              </div>
              {/* <div>{JSON.stringify(feed)}</div> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
