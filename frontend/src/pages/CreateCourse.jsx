import useFetch from '../hooks/useFetch';
const CreateCourse = () => {

    const {data:departments,loading,error} = useFetch('http://localhost:5225/api/department');
    return (
        <div>
            <h1>Create Course Page</h1>
            <form>
                <input type="text" placeholder="Course Title" /><br />
                <textarea placeholder="Course Description"></textarea>
                <br />
                <input type="file" /><br />
                <select>
                    {departments && departments.map(department => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                </select>
                <label>Kaçıncı Sınıf</label>
                <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                
                <button type="submit">Create Course</button>
            </form>
        </div>

    );
}
export default CreateCourse;