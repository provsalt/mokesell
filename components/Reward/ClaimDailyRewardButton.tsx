"use client";

import { Button } from "@/components/ui/button";
import { claimDailyReward } from "@/actions/claimDailyReward";
import { useToast } from "@/components/ui/use-toast";

export const ClaimDailyRewardButton = () => {
  const { toast } = useToast();
  const claim = async () => {
    const res = await claimDailyReward();
    if (!res) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You've already claimed today's reward",
      });
      return;
    }
    toast({
      variant: "default",
      title: "Success",
      description: "$0.01 has been added to your balance",
    });
  };
  return (
    <Button className="bg-blue-500 hover:bg-blue-600" onClick={claim}>
      Claim Daily Reward
    </Button>
  );
};
