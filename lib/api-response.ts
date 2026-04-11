type ApiSuccessResponse<TData> = {
  ok: true;
  data: TData;
};

type ApiErrorDetails = {
  code: string;
  message: string;
};

type ApiErrorResponse = {
  ok: false;
  error: ApiErrorDetails;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export function successResponse<TData>(data: TData, init?: ResponseInit) {
  return Response.json(
    {
      ok: true,
      data,
    } satisfies ApiSuccessResponse<TData>,
    init,
  );
}

export function errorResponse(
  code: string,
  message: string,
  init?: ResponseInit,
) {
  return Response.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    } satisfies ApiErrorResponse,
    init,
  );
}
