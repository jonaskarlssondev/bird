import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type NextPage } from "next/types";
import Chart from "../chart/chart";

const ChartPage: NextPage = () => {
    const { data: sessionData } = useSession();
    const router = useRouter(); 
    
    let ticker = router.query.chart;

    if (!sessionData || !sessionData.user) {
        return <></>;
    }

    if (Array.isArray(ticker)) {
        ticker = ticker[0]
    }

    if (!ticker) {
        return <></>
    }

    return <Chart ticker={ticker} />
}

export default ChartPage;
