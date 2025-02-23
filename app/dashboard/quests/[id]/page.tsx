import React from "react";

export default async function Quests({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <div>Profile: {id}</div>;
}
