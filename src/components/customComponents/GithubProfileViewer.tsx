import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Tab from "./Tabs";
import { GitHubRepoType, GitHubUserType } from "../../types";

interface FormValue {
  username: string;
}

function GithubProfileViewer() {
  const { register, handleSubmit } = useForm<FormValue>();

  const [userData, setUserData] = useState<GitHubUserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reposData, setRepoData] = useState<GitHubRepoType[]>([]);

  const [commitActivity, setCommitActivity] = useState<
    { date: string; count: number }[]
  >([]);

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
      {userData && <Tab userData={userData} reposData={reposData} />}
    </div>
  );
}

export default GithubProfileViewer;
