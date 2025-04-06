interface GitHubUserType {
    login: string;
    name: string;
    location: string;
    email: string;
    bio: string;
    company: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    avatar_url: string;
    html_url: string;
    followers: number;
    following: number;
    public_repo: number;
    created_at: string;
}

interface GitHubRepoType {
    id: string;
    name: string;
    html_url: string;
    description: string;
    language: string;
    forks_count: number;
    stargazers_count: number;
    updated_at: string;
    created_at: string;
}



export type { GitHubUserType, GitHubRepoType, CommitActivityTypes };