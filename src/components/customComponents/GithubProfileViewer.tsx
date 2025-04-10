import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Tab from "./Tabs";
import { GitHubRepoType, GitHubUserType, ChartDataType } from "../../types";

interface FormValue {
  username: string;
}

function GithubProfileViewer() {
  const { register, handleSubmit } = useForm<FormValue>();

  const [userData, setUserData] = useState<GitHubUserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reposData, setRepoData] = useState<GitHubRepoType[]>([]);

  const [commitActivity, setCommitActivity] = useState<ChartDataType[]>([]);

  const handleSubmitFn = async (data: { username: string }) => {
    if (data.username.trim() === "") {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    setRepoData([]);
    setUserData(null);
    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${data.username}`
      );
      if (!userResponse.ok) {
        throw new Error(
          userResponse.status === 404
            ? `User not found`
            : `Error while fetching user data: ${userResponse.statusText}`
        );
      }

      const userData = await userResponse.json();
      setUserData(userData);

      const userRepos = await fetch(
        `https://api.github.com/users/${data.username}/repos?sort=created`
      );
      if (!userRepos.ok) {
        throw new Error(
          `Could not fetch user repos : ${userRepos.statusText} `
        );
      }

      const reposData = await userRepos.json();
      setRepoData(reposData);
      // below code is to get the number of commits per day

      const repos = await fetch(
        `https://api.github.com/users/${data.username}/repos?sort=updated`
      );

      if (!repos.ok) {
        throw new Error(`Could not fetch user repos : ${repos.statusText} `);
      }
      const reposArray = await repos.json();
      console.log("reposArray", reposArray);

      const commitFetches = reposArray.slice(0, 5).map((repo) =>
        fetch(
          `https://api.github.com/repos/${data.username}/${repo.name}/commits?author=${data.username}`
        )
          .then((res) => res.json())
          .catch(() => [])
      );

      const commitData = await Promise.allSettled(commitFetches);

      console.log("commitData", commitData);

      const dateCountMap: Record<string, number> = {};

      commitData.forEach((result) => {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          result.value.forEach((commit) => {
            if (commit?.commit?.author?.date) {
              const date = new Date(commit.commit.author.date).toLocaleDateString(); // "YYYY-MM-DD"
              dateCountMap[date] = (dateCountMap[date] || 0) + 1;
            }
          });
        }
      });

      console.log("dateCountMap", dateCountMap);

      const chartData = Object.entries(dateCountMap)
        .map(([date, commits]) => ({ date, commits }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      console.log("chartData", chartData);
      setCommitActivity(chartData);

    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitFn)}
        className="w-full flex gap-5"
      >
        <Input
          placeholder="Enter GitHub Username"
          type="string"
          {...register("username")}
        />
        <Button type="submit" size="lg" className="h-12 bg-black   text-lg">
          {loading ? (
            <Loader2 className="items-center h-5 w-5 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-2 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
      {userData && <Tab userData={userData} reposData={reposData} chartData={commitActivity} />}
    </div>
  );
}

export default GithubProfileViewer;
