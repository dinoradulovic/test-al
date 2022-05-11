import indexRouter from "./index-router";
import usersRouter from "../../features/users/routers/users-router";
import meRouter from "../../features/me/routers/me-router";
import userSessionsRouter from "../../features/user-sessions/routers/user-sessions-router";
import emailVerificationsRouter from "../../features/email-verifications/routers/email-verifications-router";
import passwordResetRequestsRouter from "../../features/password-resets/routers/password-reset-requests-router";
import passwordResetRouter from "../../features/password-resets/routers/password-resets-router";

export function setupRouting(app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/user-sessions', userSessionsRouter);
    app.use('/me', meRouter);
    app.use('/email-verifications', emailVerificationsRouter);
    app.use('/password-reset-requests', passwordResetRequestsRouter);
    app.use('/password-reset', passwordResetRouter);
}
