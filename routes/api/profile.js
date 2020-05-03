const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authorization");
const Profile = require("../../Models/Profile");
const User = require("../../Models/User");
const { check, validationResult } = require("express-validator");
const axios = require("axios");

//get profile details
router.get("/myprofile", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(400).json({ message: "profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
  //  res.send("profile page")
});

//add profile details
router.post(
  "/myprofile",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("skills", "skills are needed").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      place,
      linkedin,
      githublink,
      skills,
      experience,
      hobbies,
      website,
    } = req.body;

    const profileObject = {};

    profileObject.user = req.user.id;
    profileObject.title = title;

    if (place) {
      profileObject.place = place;
    }
    if (linkedin) {
      profileObject.linkedin = linkedin;
    }
    if (githublink) {
      profileObject.githublink = githublink;
    }
    if (experience) {
      profileObject.experience = experience;
    }
    if (hobbies) {
      profileObject.hobbies = hobbies;
    }
    if (website) {
      profileObject.website = website;
    }

    if (skills) {
      profileObject.skills = skills.split(",").map((skill) => skill.trim());
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileObject },
          { new: true }
        );
        console.log(profile);
        return res.json(profile);
      }

      //new profile
      profile = new Profile(profileObject);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//get all profile details
router.get("/allprofile", async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.json(allProfiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).message("error");
  }
});

//get profile details by userid
router.get("/:userid", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userid,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ message: "no profile found for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).message("error");
  }
});

//delete profile,user and related data
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ message: "profile and user deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).message("error");
  }
});

//get github repo details

router.get("/github/:githubusername", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.githubusername}/repos?per_page=3`
    );

    const header = {};

    const githubData = await axios.get(uri, { header });
    return res.json(githubData.data);
  } catch (error) {
    console.error(error.message);
    return res.status(404).json({ message: "Github profile not found" });
  }
});

module.exports = router;
