/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { OnBoardingDataConsumer } from "context/onBoardingData";
import { setOnBoardingData } from "reducers/onBoardingReducer";

import "./styles.scss";

const OnBoarding = () => {
  const [onBoardingData, dispatch] = OnBoardingDataConsumer();

  const handleOverlayClick = () => {
    if (onBoardingData.step === 5) {
      dispatch(
        setOnBoardingData({
          startOnBoarding: false,
          step: 0,
        })
      );
    } else {
      dispatch(
        setOnBoardingData({
          startOnBoarding: true,
          step: onBoardingData.step + 1,
        })
      );
    }
  };

  useEffect(() => {
    const sider = document.getElementById("ant-layout-sider");
    if (
      onBoardingData.startOnBoarding &&
      (onBoardingData.step === 4 || onBoardingData.step === 5)
    ) {
      sider.style.zIndex = 8;
      sider.style.pointerEvents = "none";
    } else {
      sider.style.zIndex = "unset";
      sider.style.pointerEvents = "unset";
    }
  }, [onBoardingData?.step]);

  return (
    <div className="onboarding-overlay" onClick={() => handleOverlayClick()}>
      {onBoardingData.step === 1 && (
        <div className="onboarding-text step-1">
          This is where you manage your team, add admins and create teams.
          <div className="onboarding-text-arrow"></div>
        </div>
      )}
      {onBoardingData.step === 2 && (
        <div className="onboarding-text step-2">
          This is where you can enable/disable leaderboard, add different
          company offices, add timezones.
          <div className="onboarding-text-arrow"></div>
        </div>
      )}
      {onBoardingData.step === 3 && (
        <div className="onboarding-text step-3">
          This is where you can create team, add managers, members and set up
          happiness and culture survey.
          <div className="onboarding-text-arrow"></div>
        </div>
      )}
      {onBoardingData.step === 4 && (
        <div className="onboarding-text step-4">
          This is where you can view anonymized analytics for your team and
          company. To mantain anonymity, we only show data when its for greater
          than 5 people.
          <div className="onboarding-text-arrow"></div>
        </div>
      )}
      {onBoardingData.step === 5 && (
        <div className="onboarding-text step-5">
          After collecting data for 4 weeks we recommend online events to you.
          <div className="onboarding-text-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default OnBoarding;
