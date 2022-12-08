import "../App.css";
import {
  useAddress,
  useMetamask,
  useSigner,
  useChainId,
  useNetwork,
  ChainId,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import constant from "../config/constant";

const biconomyDappKeys = {
  5: constant.config.BICONOMY_GOERLI_DAPP_API_KEY,
  80001: constant.config.BICONOMY_MUMBAI_DAPP_API_KEY,
};

const biconomyDeployMethodIds = {
  5: constant.config.BICONOMY_GOERLI_DEPLOY_METHOD_ID,
  80001: constant.config.BICONOMY_MUMBAI_DEPLOY_METHOD_ID,
}

const networks = {
  5: "goerli",
  80001: "mumbai"
}

const NewCollection = () => {
  const inputFile = useRef(null);
  const nav = useNavigate();
  const { collectionType } = useParams();
  const address = useAddress();
  const signer = useSigner();
  const chainId = useChainId();
  const [, switchNetwork] = useNetwork();

  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [primarySaleRecipient, setPrimarySaleRecipient] = useState(address);
  const [royaltiesSaleRecipient, setRoyaltiesSaleRecipient] = useState(address);
  const [royaltiesPercentage, setRoyaltiesPercentage] = useState(0);
  const [blockChain, setBlockChain] = useState(80001);
  const [formerrors, setFormErrors] = useState({});
  const [verified, setVerified] = useState(false);

  const beforeCreateAndDeploy = async (event) => {
    event.preventDefault();
    try {
      if (!address || !signer) {
        return;
      }

      if (!validate()) return;
  
      if (chainId !== blockChain) {
        const switchResult = await switchNetwork(blockChain);
        if (switchResult.data?.id) {
          setVerified(true);
        }
      } else {
        await createAndDeploy();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const deployChangedNetwork = async () => {
      await createAndDeploy();
    };

    if (verified) deployChangedNetwork();
  }, [signer]);

  const createAndDeploy = async () => {
    try {
      const collectionData = {
        name: name,
        symbol: symbol,
        description: description,
        image: image,
        primary_sale_recipient: primarySaleRecipient,
        fee_recipient: royaltiesSaleRecipient,
        seller_fee_basis_points: royaltiesPercentage * 100,
      }
      // const sdk = new ThirdwebSDK(signer, {
      const sdk = ThirdwebSDK.fromSigner(signer, networks[blockChain], {
        gasless: {
          biconomy: {
            apiId: biconomyDeployMethodIds[blockChain], 
            apiKey: biconomyDappKeys[blockChain] 
          }
        }
      });
      console.log(sdk)
      const contractAddress = await sdk.deployer.deployBuiltInContract(
        collectionType,
        collectionData
      );
      console.log("contract successfully deployed - ", contractAddress)
      nav("/");
    } catch(err) {
      console.log(err);
    }
  };

  const onImageClick = () => {
    inputFile.current?.click();
  };

  const validate = () => {
    let errors = {};
    if (!inputFile.current.files[0]) {
      errors.image = "Image is required";
    } else {
      var allowedExtensions = ["JPG", "JPEG", "PNG", "GIF", "SVG"];
      var fileName = inputFile.current.files[0].name;

      var ext = fileName.split(".").pop().toUpperCase();
      if (!allowedExtensions.includes(ext)) {
        errors.image =
          "Invalid file extension, Supported file formats: JPG, JPEG, PNG, GIF, SVG";
      }
    }

    if (!name) {
      errors.name = "Name is required";
    }

    if (!symbol) {
      errors.symbol = "Symbol is required";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
    {address && (
        <>
        <div className="formBackground">
          <Form.Group className="btnStyle">
            <Button
              variant="secondary"
              className="btnSecondary"
              type="cancel"
              onClick={() => nav("/")}
            >
              Back
            </Button>
            <h3>{collectionType.toUpperCase()}</h3>
          </Form.Group>
          <Form onSubmit={beforeCreateAndDeploy}>
            <Row>
              <Col sm={6}>
                <div>
                  <h2>Contract Metadata</h2>
                  <h5>
                    <i>
                      Settings to organize and distinguish between your
                      different contracts.
                    </i>
                  </h5>
                  <div className="titleStyle">Image*</div>
                  <div className="fileText">
                    <Form.Label>
                      {" "}
                      File types supported: JPG, JPEG, PNG, GIF, SVG, Max
                      size:100MB
                    </Form.Label>
                  </div>
                  <div>
                    <div className="img-holder">
                      <img
                        src={image}
                        alt=""
                        id="img"
                        className="img"
                        onClick={onImageClick}
                      />
                    </div>
                    <Form.Group className=" hideNumber">
                      <Form.Control
                        type="file"
                        id="collfile"
                        ref={inputFile}
                        name="collfile"
                        accept="image/*"
                        onChange={(event) =>
                          setImage(URL.createObjectURL(event.target.files[0]))
                        }
                      />
                    </Form.Group>
                    {formerrors.image && (
                      <p className="text-warning">{formerrors.image}</p>
                    )}
                    <div className="clear"></div>
                  </div>
                </div>

                <Form.Group className="marginTop15">
                  <Form.Label className="titleStyle">
                    Collection Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Collection Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  {formerrors.name && (
                    <p className="text-warning">{formerrors.name}</p>
                  )}
                </Form.Group>

                <Form.Group className="marginTop15">
                  <Form.Label className="titleStyle">Symbol *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Symbol"
                    value={symbol}
                    onChange={(event) => setSymbol(event.target.value)}
                  />
                  {formerrors.symbol && (
                    <p className="text-warning">{formerrors.symbol}</p>
                  )}
                </Form.Group>

                <Form.Group className="marginTop15">
                  <Form.Label className="titleStyle">
                    Description *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  {formerrors.description && (
                    <p className="text-warning">{formerrors.description}</p>
                  )}
                </Form.Group>

                <h2>Payout Settings</h2>
                <h5>
                  <i>
                    Where should any funds generated by this contract flow to.
                  </i>
                </h5>

                <Form.Group className="marginTop15">
                  <h2>Primary Sales</h2>
                  <h5>
                    <i>
                      Determine the address that should receive the revenue
                      from initial sales of the assets.
                    </i>
                  </h5>
                  <Form.Label className="titleStyle">
                    Recipient Address *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Primary Sale Recipient"
                    value={primarySaleRecipient}
                    onChange={(event) =>
                      setPrimarySaleRecipient(event.target.value)
                    }
                  />
                  {formerrors.primarySaleRecipient && (
                    <p className="text-warning">
                      {formerrors.primarySaleRecipient}
                    </p>
                  )}
                </Form.Group>

                <Form.Group className="marginTop15">
                  <h2>Royalties</h2>
                  <h5>
                    <i>
                      Determine the address that should receive the revenue
                      from royalties earned from secondary sales of the
                      assets.
                    </i>
                  </h5>
                  <Form.Label className="titleStyle">
                    Recipient Address *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Royalties Sale Recipient"
                    value={royaltiesSaleRecipient}
                    onChange={(event) =>
                      setRoyaltiesSaleRecipient(event.target.value)
                    }
                  />
                  {formerrors.royaltiesSaleRecipient && (
                    <p className="text-warning">
                      {formerrors.royaltiesSaleRecipient}
                    </p>
                  )}
                  <br />
                  <Form.Label className="titleStyle">Percentage *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Percentage"
                    value={royaltiesPercentage}
                    onChange={(event) =>
                      setRoyaltiesPercentage(+event.target.value)
                    }
                  />
                  %
                  {formerrors.royaltiesPercentage && (
                    <p className="text-warning">
                      {formerrors.royaltiesPercentage}
                    </p>
                  )}
                </Form.Group>

                <Form.Group className="marginTop15">
                  <h2>Network / Chain</h2>
                  <h5>
                    <i>
                      Select a network to deploy this contract on. We
                      recommend starting with a testnet.
                    </i>
                  </h5>
                  <Form.Label className="titleStyle">Blockchain *</Form.Label>
                  <Form.Select
                    value={blockChain}
                    onChange={(event) => setBlockChain(+event.target.value)}
                  >
                    <option value="5">Goerli Testnet</option>
                    <option value="80001">Polygon Testnet (Mumbai)</option>
                  </Form.Select>
                  {formerrors.blockChain && (
                    <p className="text-warning">{formerrors.blockChain}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="btnStyle">
              <Button
                variant="secondary"
                className="btnSecondary"
                type="cancel"
                onClick={() => nav("/")}
              >
                CANCEL
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button className="btnPrimary" type="submit">
                CREATE
              </Button>
            </Form.Group>
          </Form>
        </div>
      </>
      )}
      </>
  );
};

export default NewCollection;
