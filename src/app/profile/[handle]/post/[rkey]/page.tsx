"use client";

import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Image from "next/image";

import { agent } from "~/lib/api";

interface Props {
  params: {
    handle: string;
    rkey: string;
  };
}

export default function PostView({
  params,
}: {
  params: Promise<Props["params"]>;
}) {
  const router = useRouter();
  const [post, setPost] = useState<AppBskyFeedDefs.PostView>();
  const [error, setError] = useState("");

  const { handle, rkey } = use(params);

  useEffect(() => {
    async function fetchData() {
      const h = decodeURIComponent(handle);
      if (h.startsWith("@")) {
        const handleWithoutAt = h.slice(1);
        router.replace(`/profile/${handleWithoutAt}/post/${rkey}`);
        return;
      }
      let did;
      if (h.startsWith("did:")) {
        did = h;
      } else {
        did = (await agent.resolveHandle({ handle })).data.did;
      }

      console.log({ handle, h, did });
      const uri = `at://${did}/app.bsky.feed.post/${rkey}`;

      try {
        const thread = await agent.app.bsky.feed.getPostThread({ uri });

        if (!AppBskyFeedDefs.isThreadViewPost(thread.data.thread)) {
          throw new Error("Not a post view");
        }

        const post = thread.data.thread.post;

        if (!AppBskyFeedPost.isRecord(post.record)) {
          throw new Error("Not a post record");
        }

        setPost(post);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }

    fetchData();
  }, [handle, rkey, router]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-row items-center">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );

  }

  if (!post) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-row items-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const record = post.record as AppBskyFeedPost.Record;
  const prettyDate = new Date(record.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <p className="text-xs text-gray-500">{prettyDate}</p>
        <p>{record.text}</p>
        </div>
      </div>
    </div>
  );
}
