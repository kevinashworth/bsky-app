import { AppBskyFeedDefs,AppBskyFeedPost } from "@atproto/api";
import Image from "next/image";

import { agent } from "~/lib/api";

const EXAMPLE_POST =
  "at://did:plc:vwzwgnygau7ed7b7wt5ux7y2/app.bsky.feed.post/3karfx5vrvv23";

export default async function Homepage() {
  const thread = await agent.app.bsky.feed.getPostThread({
    uri: EXAMPLE_POST,
  });

  if (!AppBskyFeedDefs.isThreadViewPost(thread.data.thread)) {
    throw new Error("Not a post view");
  }

  const post = thread.data.thread.post;
  const record = post.record as AppBskyFeedPost.Record;

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-row items-center">
          <Image
            src={post.author.avatar || "/default-avatar.png"}
            alt={post.author.handle}
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
          />
          <div className="ml-4">
            <p className="text-lg font-medium">{post.author.displayName}</p>
            <p>@{post.author.handle}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>{record.text}</p>
        </div>
      </div>
    </div>
  );
}
