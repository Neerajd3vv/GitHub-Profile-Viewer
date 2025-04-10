import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubUserType, GitHubRepoType , ChartDataType} from "@/types";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Star, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { CommmitCharts } from "./CommitCharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";



function Tab({
  userData,
  reposData,
  chartData
}: {
  userData: GitHubUserType;
  reposData: GitHubRepoType[];
  chartData: ChartDataType[];
}) {
  return (
    <Tabs defaultValue="profile" className="w-full py-4  ">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="repositories">Repositories</TabsTrigger>
        <TabsTrigger value="commits">Commits</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col space-y-1">
              <img
                src={userData.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-full"
              />
              <h1 className="text-2xl font-semibold">
                {userData.name || userData.login}
              </h1>
              <a
                href={userData.html_url}
                target="_blank"
                className="flex items-center"
              >
                <span className="text-blue-600 text-sm font-normal hover:underline">
                  {" "}
                  @{userData.login || userData.name}{" "}
                </span>

                <ExternalLink size={14} className="ml-2 text-black" />
              </a>
            </CardTitle>
            <CardDescription>
              {userData.bio && (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold text-black">Bio: </span>
                  {userData.bio}
                </p>
              )}
            </CardDescription>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center p-2 bg-muted border  rounded-md">
                  <span className="text-xl font-bold">
                    {userData.public_repos}
                  </span>
                  <span className="text-xs text-gray-700">Repositories</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted border rounded-md">
                  <span className="text-xl font-bold">
                    {userData.followers}
                  </span>
                  <span className="text-xs text-gray-700">Followers</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted border rounded-md">
                  <span className="text-xl font-bold">
                    {userData.following}
                  </span>
                  <span className="text-xs text-gray-700">Following</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {userData.company && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Company:</span>
                    <span>{userData.company}</span>
                  </div>
                )}

                {userData.location && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span className="text-gray-700">{userData.location}</span>
                  </div>
                )}

                {userData.twitter_username && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Twitter:</span>
                    <a
                      href={`https://twitter.com/${userData.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline"
                    >
                      @{userData.twitter_username}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-medium ">Joined:</span>
                  <span className="text-gray-700">
                    {" "}
                    {new Date(userData.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="repositories" className="pt-6">
        <Card className="w-full">
          <CardContent>
            {reposData.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No repositories found
              </p>
            ) : (
              <div className="space-y-4">
                {reposData.map((repo, index) => (
                  <div key={repo.id} className="space-y-2">
                    {index > 0 && <Separator />}
                    <div className="pt-2">
                      <div className="flex justify-between items-start">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-lg hover:underline flex items-center"
                        >
                          {repo.name}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                            {repo.stargazers_count}
                          </div>
                          <div className="flex items-center">
                            <GitFork className="h-3.5 w-3.5 mr-1 text-blue-500" />
                            {repo.forks_count}
                          </div>
                        </div>
                      </div>

                      {repo.description && (
                        <p className=" text-gray-700 ">{repo.description}</p>
                      )}

                      <div className="flex flex-col  mt-2">
                        <span className="text-sm flex flex-wrap text-muted-foreground">
                          <span className="text-black pr-2 font-semibold">
                            Created on:{" "}
                          </span>{" "}
                          {new Date(repo.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-sm flex flex-wrap text-muted-foreground">
                          <span className="text-black pr-2 font-semibold">
                            Updated on:
                          </span>{" "}
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2 mt-2 ">
                        {repo.language && (
                          <Badge variant="default">{repo.language}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full bg-black text-white"
              asChild
            >
              <a
                href={`https://github.com/${
                  userData.login || userData.name
                }?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View All Repositories
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="commits" className="pt-6">
        <CommmitCharts data={chartData} />
      </TabsContent>
    </Tabs>
  );
}

export default Tab;
