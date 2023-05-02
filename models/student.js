const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const StudentSchema = new Schema({
    rollno :{
        type: String,
        required : [true, 'Roll Number is Required']
    },
    password :{
        type: String,
        required : [true, 'Password is Required']
    }
});

StudentSchema.statics.authenticate = function(rollno, password, callback){
    Student.findOne({rollno: rollno})
    .exec(function(err, student){
        if(err){
            return callback(err)
        }else if(!student){
            var err = new Error('User Not Found');
            err.ststus = 401;
            return callback(err);
        }
        bcrypt.compare(password, student.password, function(err, result){
            if(result === true){
                return callback(null, student);
            } else {
                return callback();
            }
        })
    });
}


StudentSchema.pre('save', function (next) {
    var student = this;
    bcrypt.hash(student.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      student.password = hash;
      next();
    })
  });

  const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;