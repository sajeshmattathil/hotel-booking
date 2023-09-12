const adminAuthCheck=(req,res,next)=>{
    console.log(111);
    if(req.session.admin){ console.log('auth'); next() }
    else{  res.redirect('/admin')}
}

const userAuthCheck=(req,res,next)=>{
    if(req.session.user){ console.log('user authenticated'); next()}
    else{  res.redirect('/login')}
}

const ownerAuthCheck=(req,res,next)=>{
    if(req.session.owner) console.log('owner authenticated'); next()
}

module.exports={adminAuthCheck,userAuthCheck,ownerAuthCheck}