type Term = {
  column: string | null;
  value: string | object;
  termType?: string;
  type?: 'or' | 'and';
};

type SearchTermsUI = {
  terms1: Partial<Term>[] | undefined;
  type: 'or' | 'and';
  terms2: Partial<Term>[] | undefined;
};

type SearchTermsServer = {
  terms: Partial<Term>[] | undefined;
  type?: 'or' | 'and';
}[];

type SearchHistory = {
  id: string;
  key: string;
  name: string;
  type: string;
  userId: string;
  createTime: number;
  content: string;
};
