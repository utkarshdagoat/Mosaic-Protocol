import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { MosaicBg } from "@/components/ui/mosaic-bg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";
import { getUserAPI } from "@/lib/endpoints";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
   const { user, setUser } = useUserStore();
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false)
   const {toast} = useToast()
  const handleGetStartedClick = async () => {
    setLoading(true)
    axios.get(getUserAPI, {
      withCredentials: true
    })
      .then(res => {
        console.log(res)
        if (res.status === 403 || res.status === 404) {
          setUser(null)
          navigate("/login")
        } else if (res.status === 200) {
          setUser(res.data)
          navigate("/pay")
        } else {
          setUser(null)
          toast({
            description: "Can't Seem to find you, Please login again."
          })
          navigate("/login")
        }
      })
      .catch((err) => {
        console.log(err)
        setUser(null)
        toast({
          description: "Can't Seem to find you, Please login again."
        })
        navigate("/login")
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col gap-2 justify-center items-center">
      <MosaicBg />
      <h1 className="text-7xl tracking-wide font-mosaic text-primary">
        Mosaic <span className="text-muted-foreground">Protocol</span>
      </h1>
      <p className="text-muted-foreground font-semibold mb-4">
        Dynamic Multi-Chain Loan lending platform for{" "}
        <span className="text-primary">ArchWay</span>
      </p>
      <Button
        className="rounded-full font-medium"
        size={"lg"}
        variant={"expandIcon"}
        iconPlacement="right"
        Icon={MoveRight}
        onClick={handleGetStartedClick}
      >
        Get Started
      </Button>
    </div>
  );
}
