import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [tags, setTags] = useState({
    // "9889": ['aa','aaa']
  });
  const [newTag, setNewTag] = useState({
    // "98": "ouhohhohoih"
  });

  useEffect(() => {
    fetch("https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.students);
        setStudents(data.students);
      })
      .catch((e) => console.log(e));
  }, []);
  const handleTag = (e, id) => {
    console.log(newTag);
    if (e.keyCode === 13) {
      const newTags = { ...tags };
      if (!newTags[id]) {
        newTags[id] = [];
      }
      console.log(newTags)
      newTags[id].push(newTag[id]);
      console.log('newTag',newTags)
      setTags(newTags);
      setNewTag({
        ...newTag,
        [id]: [],
      });
    }
  };
  console.log(tags);
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Search by tag"
          />
        </form>
        <ul>
          {students.length !== 0 &&
            [...students]
              .filter((student) => {
                if (
                  student.firstName
                    .toLowerCase()
                    .includes(name.toLowerCase()) ||
                  student.lastName.toLowerCase().includes(name.toLowerCase())
                ) {
                  return true;
                }
                return false;
              })
              .map((student, id) => {
                return (
                  <>
                    <li className="arrange" key={student.id}>
                      <div className="pic-container">
                        <img
                          src={student.pic}
                          alt="user-avatar"
                          className="pic"
                        />
                      </div>
                      <div className="data">
                        <h1>
                          {student.firstName.toUpperCase()}{" "}
                          {student.lastName.toUpperCase()}
                        </h1>
                        <p>Email: {student.email}</p>
                        <p>Company: {student.company}</p>
                        <p>Skill: {student.skill}</p>
                        <p>
                          Average:{" "}
                          {student.grades
                            .map((grade) => parseInt(grade))
                            .reduce((acc, c) => acc + c, 0) /
                            student.grades.length}
                          %
                        </p>
                        {expanded.includes(student.id) &&
                          student.grades.map((grade, id) => (
                            <p>
                              Test {id + 1}: {grade}%
                            </p>
                          ))}
                        <div className="tag-align">
                          {tags[student.id] &&
                            tags[student.id].map((tag) => <p className="individual-tag">{tag}</p>)}
                        </div>
                        <input
                          type="text"
                          className="new-tag"
                          value={newTag[student.id]}
                          onChange={(e) =>
                            setNewTag({
                              ...newTag,
                              [student.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => handleTag(e, student.id)}
                          placeholder="Add tag"
                        />
                      </div>
                      <div className="btn">
                        <button
                          onClick={() => {
                            //if expanded
                            if (expanded.includes(student.id)) {
                              setExpanded(
                                expanded.filter((x) => student.id !== x)
                              );
                            } else {
                              //if not expanded
                              setExpanded(expanded.concat([student.id]));
                            }
                          }}
                        >
                          {expanded.includes(student.id) ? (
                            <span>&#8722; </span>
                          ) : (
                            <span>&#43;</span>
                          )}
                        </button>
                      </div>
                    </li>
                  </>
                );
              })}
        </ul>
      </div>
    </>
  );
}

export default App;
