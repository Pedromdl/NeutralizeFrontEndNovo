import React from "react";
import { Dumbbell } from "lucide-react";

export default function StravaConnectButton({ clientId, redirectUri }) {
  const handleConnect = () => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=read,activity:read_all`;
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
    >
      <Dumbbell className="w-5 h-5" />
      Conectar com Strava
    </button>
  );
}
