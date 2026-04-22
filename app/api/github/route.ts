import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const USERNAME = process.env.GITHUB_USERNAME || 'yourusername';
const TOKEN = process.env.GITHUB_TOKEN;

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (TOKEN) {
      headers['Authorization'] = `token ${TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=20`,
      {
        headers,
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const repos = await response.json();

    // Filter and format repos
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork && !repo.private)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      }));

    return NextResponse.json({ repos: filteredRepos });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
