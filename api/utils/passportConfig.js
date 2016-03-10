import passportLocal from 'passport-local';
import { User } from '../models/index';

var LocalStrategy = passportLocal.Strategy;

export default function configPassport(passport) {
  passport.serializeUser( (user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findOne({ where: {id: id} }).then( (user) => {
      done(null, user);
    }).catch((err) => {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({usernameField:'email', passwordField:'password', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({where: {email: email}}).then(user => {
      if(!user){
        return done(null, false);
      }

      if(!user.validPassword(password)){
        return done(null, false);
      }

      done(null, user);
    }).catch(err => {
      done(err);
    });

  }));
  
}
