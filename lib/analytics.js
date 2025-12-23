export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const trackEvent = (name, params = {}) => {
  if (!window.gtag || !GA_ID) return;

  window.gtag("event", name, {
    ...params,
    send_to: GA_ID,
  });
};

export const setUserContext = ({ userId, userType }) => {
  if (!window.gtag || !GA_ID) return;

  window.gtag("config", GA_ID, {
    user_id: userId,
    user_properties: {
      user_type: userType,
    },
  });
};

export const clearUserContext = () => {
  if (!window.gtag || !GA_ID) return;

  window.gtag("config", GA_ID, {
    user_id: null,
  });
};
