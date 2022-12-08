import '../App.css';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

export default function Header() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();


  return (
    <div className="center">
        {address ? (
          <>
            <a
              className="button"
              onClick={() => disconnectWallet()}
            >
              Disconnect
            </a>
            <p>{address.slice(0, 4).concat("...").concat(address.slice(-4))}</p>
          </>
        ) : (
          <a
            className="button"
            onClick={() => connectWithMetamask()}
          >
            Connect Wallet
          </a>
        )}
      </div>
  );
}
