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
        "http://localhost:3000/auth/github/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      let user =
        await prisma.user.findUnique({
          where: {
            githubId: profile.id,
          },
        });

      if (!user) {

        user =
          await prisma.user.create({
            data: {
              id: crypto.randomUUID(),
              githubId: profile.id,
              username:
                profile.username ||
                profile.displayName,
              avatarUrl:
                profile.photos?.[0]?.value,
            },
          });

      }

      return done(null, user);

    }
  )
);

passport.serializeUser(
  (user, done) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  async (id, done) => {

    const user =
      await prisma.user.findUnique({
        where: { id },
      });

    done(null, user);

  }
);

module.exports = passport;