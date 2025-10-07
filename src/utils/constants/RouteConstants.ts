export const WalletRoutes = {
  api: "/api/",
  base: "/wallet",
  transactions: "/transactions",
  pageQuery: "?page=",
  limitQuery: "&limit=",
  searchQuery: "&search=",
  typeQuery: "&type=",
  startDateQuery: "&startDate=",
  endDateQuery: "&endDate=",
};

export const CommonQueies = {
  api: "/api/",
  pageQuery: "?page=",
  limitQuery: "&limit=",
  searchQuery: "&search=",
  params: "/",
};

export const profileQueries = {
  base: "/profile",
  image: "/image",
  lawyer: {
    base: "/lawyers",
    verification: "/verification",
    professional: "/professional",
  },
};

export const ClientRoutes = {
  base: "client",
  profile: "/profile",
  Basic: "/basic",
};

export const SpecializationRoutes = {
  base: "/specialization",
};

export const PracticeAreaRoutes = {
  base: "/practicearea",
  specIdQuery: "&specId=",
};

export const CasetypeRoutes = {
  base: "/casetypes",
  pidQuery: "&pid=",
};

export const CasesRoutes = {
  base: "/cases",
  appointments: "/appointments",
  sessions: "/sessions",
  documents: "/documents",
};

export const CommissionRoutes = {
  base: "/commission",
  settings: "/settings",
  transactions: "/transactions",
};
