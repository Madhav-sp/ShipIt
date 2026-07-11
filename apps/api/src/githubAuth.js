const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        `${process.env.API_URL || "https://deployr.space"}/auth/github/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            githubId: profile.id,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              id: crypto.randomUUID(),
              githubId: profile.id,
              username:
                profile.username ||
                profile.displayName ||
                profile._json.login,
              avatarUrl: profile.photos?.[0]?.value || "",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;