"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Search, Plus } from "lucide-react";

// Placeholder data that matches your design
const placeholderPosts = [
    { id: '1', author: { anonymousUsername: 'QuietMountain7', image: '/avatars/1.jpg' }, title: 'Tips for managing exam stress?', repliesCount: 23, upvotesCount: 12, createdAt: '5 hours ago', isTrending: false },
    { id: '2', author: { anonymousUsername: 'CreativeCat22', image: '/avatars/2.jpg' }, title: 'How to deal with social anxiety?', repliesCount: 15, upvotesCount: 8, createdAt: '5 hours ago', isTrending: false },
    { id: '3', author: { anonymousUsername: 'OceanBreeze99', image: '/avatars/3.jpg' }, title: 'Finding motivation in tough times', repliesCount: 28, upvotesCount: 21, createdAt: '8 hours ago', isTrending: true, lastReplyBy: 'WiseOwl' },
    { id: '4', author: { anonymousUsername: 'GentleRain8', image: '/avatars/4.jpg' }, title: 'Coping with loneliness this holiday?', repliesCount: 1, upvotesCount: 5, createdAt: '1 day ago', isTrending: false, lastReplyBy: 'KindHeart' },
    { id: '5', author: { anonymousUsername: 'Stargazer5', image: '/avatars/1.jpg' }, title: 'Approaching difficult conversations', repliesCount: 9, upvotesCount: 3, createdAt: '2 days ago', isTrending: false },
    { id: '6', author: { anonymousUsername: 'MindfulExplorer', image: '/avatars/2.jpg' }, title: 'Mindfulness for beginners?', repliesCount: 18, upvotesCount: 11, createdAt: '3 days ago', isTrending: false },
];

export type Post = {
  id: string;
  author: {
    anonymousUsername: string;
    image: string;
  };
  title: string;
  repliesCount: number;
  upvotesCount: number;
  createdAt: string;
  isTrending: boolean;
  lastReplyBy?: string;
};

export function Forum({ initialPosts }: { initialPosts: Post[] }) {
    const [activeTab, setActiveTab] = useState<'latest' | 'top'>('latest');
    const posts = initialPosts.length > 0 ? initialPosts : placeholderPosts;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header and Tabs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Community Forum</h2>
                    <p className="text-gray-500">Share, connect, and support one another.</p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg p-1 mt-4 md:mt-0">
                    <button
                        onClick={() => setActiveTab('latest')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'latest' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Latest Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('top')}
                        className={` cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'top' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Top Posts
                    </button>
                </div>
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="cursor-pointer bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all duration-200">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <img src={post.author.image} alt="avatar" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{post.author.anonymousUsername}</p>
                                    <p className="text-xs text-gray-500">Anonymous User</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 leading-tight">{post.title}</h3>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-3">
                                {post.repliesCount} replies • Posted {post.createdAt}
                                {post.lastReplyBy && <span> • Last reply by <span className="font-semibold text-blue-600">{post.lastReplyBy}</span></span>}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="text-xs font-medium">{post.upvotesCount}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-medium">{post.repliesCount}</span>
                                    </div>
                                </div>
                                {post.isTrending && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        Trending
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
                <button className="flex-shrink-0 flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="cursor-pointer">Start a New Discussion</span>
                </button>
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Find a topic..."
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
