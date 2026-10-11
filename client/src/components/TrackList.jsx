import TrackListItem from "./TrackListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import TextSkeleton from "./TextSkeleton";

const fetchTracks = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });

  if (
    !Array.isArray(res.data?.posts) ||
    res.data.posts.some(
      (track) =>
        !track ||
        typeof track !== "object" ||
        typeof track._id !== "string"
    )
  ) {
    throw new Error("The music service returned invalid track data.");
  }

  return res.data;
};

const TrackList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["tracks", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchTracks(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "pending") {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200/70 dark:border-slate-800 p-5">
            <TextSkeleton lines={4} />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <p role="alert" className="text-red-700 dark:text-red-300">
        Unable to load music: {error.message}
      </p>
    );
  }

  const allTracks = data?.pages?.flatMap((page) => page.posts) || [];

  if (!allTracks.length) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 text-slate-600 shadow-card dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        No music found.
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allTracks.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="py-4">
          <TextSkeleton lines={2} />
        </div>
      }
      endMessage={
        <p className="text-slate-500 dark:text-slate-400 py-3">
          <b>All music loaded!</b>
        </p>
      }
    >
      {allTracks.map((track) => (
        <TrackListItem key={track._id} track={track} />
      ))}
    </InfiniteScroll>
  );
};

export default TrackList;
