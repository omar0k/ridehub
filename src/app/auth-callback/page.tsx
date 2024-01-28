"use client";
import { trpc } from "../_trpc/client";

const Page = () => {
  const { data } = trpc.test.useQuery();
  return <div>{data}</div>;
};
export default Page;
