export type WebsiteSignals = {
  url: string;
  title: string | null;
  description: string | null;
  language: string | null;
  headings: string[];
  callToActions: string[];
  mentionedServices: string[];
  hasWhatsApp: boolean;
  hasInstagram: boolean;
  hasForm: boolean;
  hasSchedulingTerms: boolean;
  hasChatbotSignals: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  usesHttps: boolean;
  extractedText: string;
  warnings: string[];
};

export type WebsiteFetchResult = {
  signals: WebsiteSignals | null;
  warnings: string[];
  checkedAt: string | null;
};
