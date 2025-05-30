class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;

/*
  Method   /////	URL Param Example	///// MongoDB Equivalent
  
  filter() /////  ?price[gte]=10	  ///// { price: { $gte: 10 } }

  sort()	 /////  ?sort=price,-rating////	.sort('price -rating')

  limitFields()/  ?fields=name,price ////	.select('name price')

  paginate()////  ?page=2&limit=10	/////  .skip(10).limit(10)
*/

/* 

🔑 COMMON OPERATORS
  URL    Operator	  MongoDB   Equivalent	  Meaning
  gte	   $gte	      Greater Than or Equal To
  gt	   $gt	      Greater Than
  lte	   $lte	      Less Than or Equal To
  lt	   $lt	      Less Than
  ne	   $ne	      Not Equal
  in	   $in	      Matches any in a list
  nin	   $nin	      Matches none in a list
  regex	 $regex	    Pattern matching (for strings)

*/

/*

✅ Summary for Your APIFeatures
  The most useful ones for APIs:

  gte, gt, lte, lt → For numeric filtering

  ne → Exclude values

  in, nin → Multiple value filters

  regex → Text search

*/