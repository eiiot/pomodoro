import { Fraunces, Inter } from "next/font/google";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
} from "react-feather";
import Head from "next/head";
import { NextSeo } from "next-seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export default function Home() {
  // Pomodoro Technique Timer

  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timer, setTimer] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [sessionCount, setSessionCount] = useState(1);

  const handleReset = () => {
    setIsRunning(false);

    if (isSession) {
      setTimer(sessionLength * 60);
    } else {
      setTimer(breakLength * 60);
    }
  };

  const handleSkip = () => {
    if (isSession) {
      setTimer(breakLength * 60);
      setIsSession(false);
    } else {
      setTimer(sessionLength * 60);
      setIsSession(true);
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }

    if (timer === 0) {
      if (isSession) {
        setIsSession(false);
        setTimer(breakLength * 60);
        setSessionCount(sessionCount + 1);
      } else {
        setIsSession(true);
        setTimer(sessionLength * 60);
      }
    }

    return () => clearInterval(interval);
  }, [breakLength, isRunning, isSession, sessionCount, sessionLength, timer]);

  const formatTime = (time: number, select: "minutes" | "seconds") => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (select === "minutes") {
      return minutes < 10 ? `0${minutes}` : minutes;
    }

    if (select === "seconds") {
      return seconds < 10 ? `0${seconds}` : seconds;
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="https://emojicdn.elk.sh/⏳" />
      </Head>
      <NextSeo
        title={
          isRunning
            ? formatTime(timer, "minutes") + ":" + formatTime(timer, "seconds")
            : "pomodoro"
        }
        description="the world's most minimalist pomodoro timer"
        openGraph={{
          title:
            formatTime(timer, "minutes") + ":" + formatTime(timer, "seconds"),
          description: "the world's most minimalist pomodoro timer",
          images: [
            {
              url: "/og.png",
              width: 1200,
              height: 630,
              alt: "pomodoro timer",
            },
          ],
        }}
      />
      <main
        className={clsx(
          "flex h-screen w-full items-center justify-center p-4 font-serif dark:bg-black dark:text-white",
          inter.variable,
          fraunces.variable
        )}
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center relative">
            <div id="time-left" className="text-8xl font-light  flex flex-row">
              {/* keep the colon centered */}
              <span className="flex items-center justify-end w-16">
                {formatTime(timer, "minutes")}
              </span>
              <span className="flex items-center justify-center">:</span>
              <span className="flex items-center justify-start w-16">
                {formatTime(timer, "seconds")}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <button
              id="start_stop"
              onClick={handleStartStop}
              className=" h-8 w-8 flex items-center justify-center"
            >
              {isRunning ? (
                <Pause size={20} className="dark:fill-white fill-black" />
              ) : (
                <Play size={20} className="dark:fill-white fill-black" />
              )}
            </button>
            <button
              id="back"
              onClick={handleSkip}
              className=" h-8 w-8 flex items-center justify-center ml-4"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
            <button
              id="reset"
              onClick={handleReset}
              className=" w-8 h-8 flex items-center justify-center ml-4"
            >
              <RefreshCw size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 my-auto mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <a href="https://eliothertenstein.com">by eliot</a>
        </div>
      </main>
    </>
  );
}
