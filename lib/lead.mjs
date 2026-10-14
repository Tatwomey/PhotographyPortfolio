const ARTISTS = new Set(["korn", "staind", "iamx", "thievery_corporation"]);
export function leadPayload(detail, location) {
  if (detail?.type !== "submit" || (detail.formId || detail.formID) !== "SyxgXY") return null;
  const data = detail.metaData || {};
  const interest = String(data.band_interest || data.band_of_interest || "").trim().toLowerCase().replace(/\s+/g, "_");
  return {
    event: "generate_lead", lead_type: "print_waitlist", lead_context: "capsule_01",
    page_type: "capsule_landing", form_context: "klaviyo_embed", form_id: "SyxgXY",
    signup_status: "submitted", email_submitted: Boolean(data.email || data.$email),
    sms_submitted: Boolean(data.phone_number || data.$phone_number),
    band_interest: ARTISTS.has(interest) ? interest : null,
    page_path: location.pathname, page_location: location.origin + location.pathname,
  };
}
