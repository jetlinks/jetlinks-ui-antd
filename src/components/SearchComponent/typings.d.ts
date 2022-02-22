type Term = {
  column: string | null;
  value: string;
  termType: string;
  type?: 'or' | 'and';
};

type SearchTermsUI = {
  terms1: Partial<Term>[];
  type: 'or' | 'and';
  terms2: Partial<Term>[];
};

type SearchTermsServer = {
  terms: Partial<Term>[];
  type?: 'or' | 'and';
}[];
