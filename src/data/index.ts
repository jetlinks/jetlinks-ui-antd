import { zip } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { getAccessToken } from "@/utils/authority";
import { ajax } from "rxjs/ajax";

const auth$ = ajax({
    url: '/jetlinks/authorize/me',
    method: 'GET',
    headers: {
        'X-Access-Token': getAccessToken()
    }
});

const systemInfo$ = ajax({
    url: '/jetlinks/system/config/front',
    method: 'GET',
    headers: {
        'X-Access-Token': getAccessToken()
    }
});

export const root$ = zip(auth$, systemInfo$)
    .pipe(
        map(([auth, systemInfo]) => ({ auth, systemInfo })),
        shareReplay(1));