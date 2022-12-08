import '../App.css';
import {
  useAddress,
  useSigner,
  useNetworkMismatch,
  useNetwork,
  ChainId
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const contractsToDeploy = [
  "nft-collection",
  "edition",
  "edition-drop",
  "nft-drop",
];

export default function HomePage() {
  const nav = useNavigate();
  const address = useAddress();
  const signer = useSigner();
  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const [existingContracts, setExistingContracts] = useState([]);

  useEffect(() => {
    if (!address || !signer) {
      return;
    }
    if (isWrongNetwork) {
      switchNetwork(ChainId.Rinkeby);
      return;
    }
    
  }, [address, signer, isWrongNetwork]);

  return (
    <div className="center">
        {address && (
          <>
        <h2>What do you want to deploy?</h2>
          <div className="contractBoxGrid">
              {contractsToDeploy.map((contract) => (
                <div
                  className="contractBox"
                  key={contract}
                  onClick={() => nav("/new-collection/" + contract)}
                >
                  <b>
                    {contract}
                  </b>
                </div>
              ))}
          </div>
          </>
        )}
      </div>
  );
}
