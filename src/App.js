import "./App.css";
import { useEffect, useState } from "react";

const StudentCard = (props) => {
  const [newTag, setNewTag] = useState("");
  const student = props.student;
  const expanded = props.expanded;
  const expandBtnClicked = props.expandBtnClicked;
  const tags = props.tags;
  const onNewTagSubmitted = props.onNewTagSubmitted;

  return (
    <>
      <li className="arrange" key={student.id}>
        <div className="pic-container">
          <img src={student.pic} alt="user-avatar" className="pic" />
        </div>
        <div className="data">
          <h1>
            {student.firstName.toUpperCase()} {student.lastName.toUpperCase()}
          </h1>
          <div className="indenting">
            <p>Email: {student.email}</p>
            <p>Company: {student.company}</p>
            <p>Skill: {student.skill}</p>
            <p>
              Average:{" "}
              {student.grades
                .map((grade) => parseInt(grade))
                .reduce((acc, c) => acc + c, 0) / student.grades.length}
              %
            </p>
            {expanded &&
              student.grades.map((grade, id) => (
                <p>
                  Test {id + 1}: {grade}%
                </p>
              ))}
          </div>
          <div className="tag-align">
            {tags &&
              tags.map((tag) => (
                <div>
                  <p className="individual-tag">{tag} </p>
                </div>
              ))}
          </div>
          <input
            type="text"
            className="new-tag"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onNewTagSubmitted(newTag);
                setNewTag("");
              }
            }}
            placeholder="Add tag"
          />
        </div>
        <div className="btn">
          <button
            onClick={() => {
              expandBtnClicked();
            }}
          >
            {expanded ? <span>&#8722; </span> : <span>&#43;</span>}
          </button>
        </div>
      </li>
    </>
  );
};

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [tags, setTags] = useState({});
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    fetch("https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
      })
      .catch((e) => console.log(e));
  }, []);

  const studentMatchesNameSearch = (student, searchTerm) => {
    if (!searchTerm) {
      return true;
    }

    return (
      student.firstName.toLowerCase().includes(name.toLowerCase()) ||
      student.lastName.toLowerCase().includes(name.toLowerCase())
    );
  };

  const studentMatchesTag = (student, tag) => {
    if (!tag) {
      return true;
    }

    const tagsOfStudent = tags[student.id];
    if (!tagsOfStudent) {
      return false;
    }
    return doesStringMatchAnyStringInArray(tagsOfStudent, tag);
  };

  const doesStringContainOtherString = (s, searchTerm) => {
    return s.toLowerCase().includes(searchTerm.toLowerCase());
  };
  const doesStringMatchAnyStringInArray = (arrayStrings, searchTerm) => {
    return arrayStrings
      .map((str) => doesStringContainOtherString(str, searchTerm))
      .includes(true);
  };

  return (
    <>
      <div className="container">
        <form>
          <input
            type="text"
            name="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name"
          />
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Search by tag"
          />
        </form>
        <ul>
          {students.length !== 0 &&
            [...students]
              .filter((student) => {
                if (
                  studentMatchesNameSearch(student, name) &&
                  studentMatchesTag(student, searchTag)
                ) {
                  return true;
                }
                return false;
              })
              .map((student) => (
                <StudentCard
                  student={student}
                  expanded={expanded.includes(student.id)}
                  expandBtnClicked={() => {
                    if (expanded.includes(student.id)) {
                      setExpanded(expanded.filter((x) => student.id !== x));
                    } else {
                      setExpanded(expanded.concat([student.id]));
                    }
                  }}
                  tags={tags[student.id]}
                  onNewTagSubmitted={(newTag) => {
                    const newTags = { ...tags };
                    if (!newTags[student.id]) {
                      newTags[student.id] = [];
                    }
                    newTags[student.id].push(newTag);
                    setTags(newTags);
                  }}
                />
              ))}
        </ul>
      </div>
    </>
  );
}

export default App;
