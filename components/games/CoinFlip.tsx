"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCoinFlip } from "@/actions/bet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CoinFlip = ({ balance }: { balance: number }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [bet, setBet] = useState(0);
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  const { toast } = useToast();

  const flipCoin = async () => {
    if (isFlipping || bet <= 0) return;

    setIsFlipping(true);
    const result = await PlayCoinFlip(bet, selectedSide);
    if (!result || !result.success) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: `You only have $${balance} but you're trying to bet $${bet}`,
      });
      setIsFlipping(false);
      return;
    }
    const newResult = result.result as "heads" | "tails";

    setTimeout(() => {
      setResult(newResult);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center mb-8 gap-2">
            <h1 className="text-3xl font-bold text-center">MokeFlip</h1>
            <p className="text-muted-foreground">
              Taking profit flipping to the next level
            </p>
          </div>

          <motion.div
            className="w-full p-4 bg-gradient-to-br from-blue-500 to-fuchsia-500 rounded-lg mb-6"
            layout
          >
            <p className="text-white text-sm">Balance</p>
            <motion.p
              className="text-2xl font-bold text-white"
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              ${balance.toFixed(2)}
            </motion.p>
          </motion.div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bet Amount</label>
              <Input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
                placeholder="Enter bet amount"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Side</label>
              <div className="flex gap-2">
                <Button
                  variant={selectedSide === "heads" ? "default" : "outline"}
                  onClick={() => setSelectedSide("heads")}
                  className="flex-1"
                >
                  Heads
                </Button>
                <Button
                  variant={selectedSide === "tails" ? "default" : "outline"}
                  onClick={() => setSelectedSide("tails")}
                  className="flex-1"
                >
                  Tails
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <motion.div className="relative w-40 h-40">
              <AnimatePresence>
                <motion.div
                  onClick={flipCoin}
                  aria-disabled={bet === 0}
                  key={isFlipping ? "flipping" : "static"}
                  animate={{
                    rotateX: isFlipping ? 720 : 0,
                    scale: isFlipping ? 1.2 : 1,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-lg flex items-center justify-center cursor-pointer",
                    bet === 0 && "cursor-not-allowed",
                  )}
                >
                  {result ? (
                    <span className="text-2xl font-bold text-yellow-800">
                      {result.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-lg text-yellow-800">
                      Click to flip!
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={flipCoin}
            disabled={isFlipping || bet <= 0}
            className="w-full mb-6"
          >
            {isFlipping ? "Flipping..." : `Flip Coin ($${bet})`}
          </Button>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center justify-center gap-2 ">
                      <CircleHelp size={16} />
                      <span>Potential Win</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Your odds of winning is 50%, this is done securely using
                        a cryptographically random number
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-2xl font-bold">${bet.toFixed(2)}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinFlip;
