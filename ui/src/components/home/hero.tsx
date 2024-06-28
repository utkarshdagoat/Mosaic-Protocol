import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import mosaicToken from "@/assets/tokens/mosaic-token.svg";
import { ContainerScroll } from "../ui/container-scroll-animation";

import { useUserStore } from "@/hooks/useStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

import axios from "axios";
import { getUserAPI } from "@/lib/endpoints";

export default function Hero() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleGetStartedClick = async () => {
    setLoading(true);
    axios
      .get(getUserAPI, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 403 || res.status === 404) {
          setUser(null);
          navigate("/login");
        } else if (res.status === 200) {
          setUser(res.data);
          navigate("/dashboard");
        } else {
          setUser(null);
          toast({
            description: "Can't Seem to find you, Please login again.",
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        toast({
          description: "Can't Seem to find you, Please login again.",
        });
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="relative">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-background bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(248,115,81,0.3),rgba(255,255,255,0))]"></div>
      <section className="relative max-w-full mx-auto z-1">
        <div className="max-w-screen-xl z-10 mx-auto px-4 gap-12 md:px-8">
          <ContainerScroll
            titleComponent={
              <div className="space-y-5 max-w-4xl leading-4 lg:leading-5 mx-auto text-center">
                <h1 className="text-4xl bg-clip-text leading-6 mx-auto md:text-6xl">
                  Don't just hold{" "}
                  <span className="font-semibold text-primary">ARCH,</span>
                  <br />
                  <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-primary to-red-400 to-[80%] uppercase">
                    Leverage it{" "}
                  </span>
                </h1>
                <p className="w-[48ch] text-lg mx-auto text-muted-foreground">
                  Unleash the full potential of ARCH with{" "}
                  <span className="font-mosaic text-2xl text-primary uppercase">
                    Mosaic
                  </span>
                  's leverage. Multiply your returns without tying up more
                  capital.
                </p>

                <Button
                  size={"lg"}
                  variant={"expandIcon"}
                  iconPlacement="right"
                  Icon={ChevronRight}
                  className="rounded-full px-8 py-6"
                  onClick={handleGetStartedClick}
                >
                  Get Started
                </Button>
              </div>
            }
          >
            <img src={mosaicToken} className="w-[60%] mx-auto" alt="" />
          </ContainerScroll>
        </div>
      </section>
    </div>
  );
}
